import tensorflow as tf
import numpy as np
from collections import defaultdict
from sklearn.metrics import classification_report, confusion_matrix
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input


MODEL_PATH = "model/mri_parkinson_final.keras"
TEST_DIR = "dataset_split/test"
IMG_SIZE = (192, 192)
BATCH_SIZE = 8


model = tf.keras.models.load_model(
    MODEL_PATH,
    custom_objects={"preprocess_input": preprocess_input}
)


test_ds = tf.keras.preprocessing.image_dataset_from_directory(
    TEST_DIR,
    image_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    shuffle=False
)

class_names = test_ds.class_names
print("Classes:", class_names)


y_true = []
y_pred = []
subjects = []

file_paths = test_ds.file_paths  

for batch, (images, labels) in enumerate(test_ds):
    probs = model.predict(images).flatten()
    preds = (probs > 0.4).astype(int)

    y_true.extend(labels.numpy())
    y_pred.extend(preds)


print("\nImage-level Classification Report:")
print(classification_report(y_true, y_pred))

print("\nConfusion Matrix:")
print(confusion_matrix(y_true, y_pred))