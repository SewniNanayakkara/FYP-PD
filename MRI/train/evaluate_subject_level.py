import os
import numpy as np
import tensorflow as tf
from collections import defaultdict
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input


IMG_SIZE = (192, 192)
MODEL_PATH = "mri_parkinson_final.keras"
TEST_DIR = "dataset_split/test"

model = tf.keras.models.load_model(
    MODEL_PATH,
    custom_objects={"preprocess_input": preprocess_input}
)



images = []
labels = []
subjects = []

for label_name in ["Healthy", "Parkinson"]:
    label = 0 if label_name == "Healthy" else 1
    class_dir = os.path.join(TEST_DIR, label_name)

    for fname in os.listdir(class_dir):
        img_path = os.path.join(class_dir, fname)

        img = tf.keras.preprocessing.image.load_img(
            img_path, target_size=IMG_SIZE
        )
        img = tf.keras.preprocessing.image.img_to_array(img)
        images.append(img)
        labels.append(label)

        subject_id = fname.split("_")[0] 
        subjects.append(subject_id)

images = np.array(images)
labels = np.array(labels)




probs = model.predict(images, batch_size=4)[:, 1]


THRESHOLD = 0.4
preds = (probs > THRESHOLD).astype(int)




subject_votes = defaultdict(list)
subject_true = {}

for s, p, y in zip(subjects, preds, labels):
    subject_votes[s].append(p)
    subject_true[s] = y

correct = 0
for s in subject_votes:
    final_pred = int(np.mean(subject_votes[s]) > 0.5)
    if final_pred == subject_true[s]:
        correct += 1

subject_accuracy = correct / len(subject_votes)
print("🔥 SUBJECT-LEVEL ACCURACY:", subject_accuracy)
