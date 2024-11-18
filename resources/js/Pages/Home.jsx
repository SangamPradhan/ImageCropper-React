import React, { useState } from 'react';

export default function Home() {
    const [image, setImage] = useState(null);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleForm = async(e)=>{
        e.preventDefault();

    }

    return (
        <>
            <h1 className="title">Choose an Image to View</h1>
            <form onSubmit={handleForm}>
                <input type="file" accept="image/*" onChange={handleImageChange} /> <br />
                <button type="submit" className="primary-btn" style={{ marginTop: '20px' }}>Upload</button>
            </form>

            {/* Preview the image */}
            {image && <img src={image} alt="Uploaded Preview" style={{ marginTop: '20px', maxWidth: '50%', height: 'auto' }} />}
        </>
    );
}
