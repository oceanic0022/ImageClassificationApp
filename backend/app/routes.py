from flask import Flask, request, jsonify
from app import app
from app.classifier import classify_image

@app.route('/api/classify', methods=['POST'])
def classify():
    if 'image' not in request.files:
        return jsonify({'error': 'No image file'}), 400
    image = request.files['image']
    result = classify_image(image)
    return jsonify(result)
