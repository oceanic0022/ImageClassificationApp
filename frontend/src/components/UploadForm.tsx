import React, { useState } from 'react';
import axios from 'axios';

const UploadForm: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await axios.post('http://localhost:5000/api/classify', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log(response.data); // 分類結果を表示または処理
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="file" onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)} />
            <button type="submit">Upload and Classify</button>
        </form>
    );
};

export default UploadForm;
