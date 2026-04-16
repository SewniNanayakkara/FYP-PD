import tensorflow as tf
import numpy as np
from sklearn.metrics import classification_report, confusion_matrix


MODEL_PATH = "parkinsons_handwriting_model.keras"
TEST_DIR = "dataset_split/test"
IMG_SIZE = (224, 224)
BATCH_SIZE = 32


model = tf.keras.models.load_model(MODEL_PATH, compile=False)

model.compile(
    optimizer="adam",
    loss="sparse_categorical_crossentropy",
    metrics=["accuracy"]
)


test_ds = tf.keras.preprocessing.image_dataset_from_directory(
    TEST_DIR,
    image_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    shuffle=False
)

class_names = test_ds.class_names
print("Classes:", class_names)


loss, accuracy = model.evaluate(test_ds)
print("\nTest Accuracy:", accuracy)


y_true = []
y_pred = []

for images, labels in test_ds:
    preds = model.predict(images)
    preds = np.argmax(preds, axis=1)

    y_true.extend(labels.numpy())
    y_pred.extend(preds)


print("\nClassification Report:")
print(classification_report(y_true, y_pred, target_names=class_names))

print("\nConfusion Matrix:")
print(confusion_matrix(y_true, y_pred))