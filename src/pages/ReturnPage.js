// ReturnProductForm.js

import React, { useState } from 'react';

const ReturnPage = () => {
    const [reason, setReason] = useState('');
    const [comments, setComments] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        // You can send the form data to the server here
        // using an HTTP request (e.g., fetch, axios)
        // Example:
        const formData = {
            reason: reason,
            comments: comments
        };
    };

    return (
        <div>
            <h2>Return Product</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="reason">Reason for Return:</label>
                    <select id="reason" value={reason} onChange={(e) => setReason(e.target.value)}>
                        <option value="">Select a reason</option>
                        <option value="Wrong size">Wrong size</option>
                        <option value="Defective">Defective</option>
                        <option value="Changed my mind">Changed my mind</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="comments">Comments:</label>
                    <textarea id="comments" value={comments} onChange={(e) => setComments(e.target.value)} />
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default ReturnPage;
