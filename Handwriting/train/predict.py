import sys
import tensorflow as tf
import numpy as np
from PIL import Image

MODEL_PATH = "parkinsons_handwriting_model.keras"
IMG_SIZE = 224
CLASS_NAMES = ["Healthy", "Parkinsons"]


model = tf.keras.models.load_model(
    MODEL_PATH,
    compile=False,
    safe_mode=False
)

img_path = sys.argv[1]

img = Image.open(img_path).convert("RGB")
img = img.resize((IMG_SIZE, IMG_SIZE))

img_array = np.array(img, dtype=np.float32) / 255.0
img_array = np.expand_dims(img_array, axis=0)

pred = model.predict(img_array)[0]
pred_class = CLASS_NAMES[int(np.argmax(pred))]
confidence = float(np.max(pred)) * 100

print("Prediction :", pred_class)
print("Confidence :", f"{confidence:.2f}%")
