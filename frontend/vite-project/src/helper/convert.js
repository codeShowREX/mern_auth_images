export const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            // Get the base64 string
            let base64 = reader.result;
            
            // Create an image element to get dimensions
            const img = new Image();
            img.src = base64;
            
            img.onload = () => {
                // Create a canvas to resize the image
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = 400;
                const MAX_HEIGHT = 400;
                let width = img.width;
                let height = img.height;
                
                // Calculate new dimensions while maintaining aspect ratio
                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height = Math.round((height * MAX_WIDTH) / width);
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width = Math.round((width * MAX_HEIGHT) / height);
                        height = MAX_HEIGHT;
                    }
                }
                
                // Resize the image
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                
                // Convert to base64 with reduced quality
                const resizedBase64 = canvas.toDataURL('image/jpeg', 0.7);
                resolve(resizedBase64);
            };
            
            img.onerror = () => {
                reject(new Error('Failed to load image'));
            };
        };
        reader.onerror = (error) => reject(error);
    });
}; 