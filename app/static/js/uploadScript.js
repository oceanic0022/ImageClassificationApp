document.addEventListener("DOMContentLoaded", () => {
    const dropArea = document.getElementById("dropArea");
    const fileInput = document.getElementById("fileInput");
    const uploadButton = document.getElementById("uploadButton");

    ["dragenter", "dragover", "dragleave", "drop"].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ["dragenter", "dragover"].forEach(eventName => {
        dropArea.addEventListener(eventName, highlight, false);
    });

    ["dragleave", "drop"].forEach(eventName => {
        dropArea.addEventListener(eventName, unhighlight, false);
    });

    function highlight() {
        dropArea.classList.add("highlight");
    }

    function unhighlight() {
        dropArea.classList.remove("highlight");
    }

    dropArea.addEventListener("drop", handleDrop, false);

    function handleDrop(e) {
        let dt = e.dataTransfer;
        let files = dt.files;

        fileInput.files = files;
        handleFiles(files);
    }

    function handleFiles(files) {
        files = [...files];
        previewFile(files[0]);
    }

    function previewFile(file) {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = function() {
            // 画像プレビューの前に、前の画像をクリア
            dropArea.innerHTML = ''; // 画像をドロップエリア内に表示するため、内容をクリア
            let img = document.createElement('img');
            img.src = reader.result;
            dropArea.appendChild(img); // 画像をドロップエリア内に追加
        }
    }

    dropArea.addEventListener("click", () => fileInput.click());
    fileInput.addEventListener("change", function() {
        handleFiles(this.files);
    });

    uploadButton.addEventListener("click", uploadImage);

    function uploadImage() {
        if (fileInput.files.length > 0) {
            const formData = new FormData();
            formData.append("image", fileInput.files[0]);
    
            fetch('/upload', {
                method: 'POST',
                body: formData,
            })
            .then(response => response.json())
            .then(data => {
                console.log(data); // 受け取ったデータを確認
                const resultsContainer = document.getElementById("result");
                resultsContainer.innerHTML = ''; // 既存の結果をクリア
                // 結果表示用のHTML文字列を生成
                let resultsHtml = data.map(result => 
                    `${result.class}: ${result.confidence.toFixed(2)}%`
                ).join('<br>');
                // 結果を表示
                document.getElementById("result").innerHTML = resultsHtml;
            })
            .catch(error => console.error('Error:', error));
        } else {
            alert("Please select or drop a file first.");
        }
    }
});
