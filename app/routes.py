from flask import request, jsonify, render_template
from . import app 
from .classifier import classify_image

@app.route('/', methods=['GET'])
def home():
    # GETリクエストの場合は、画像アップロードフォームを表示
    return render_template('upload_form.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'image' not in request.files:
        return jsonify({'error': 'No image file'}), 400
    image = request.files['image']
    result = classify_image(image)
    return jsonify(result)
