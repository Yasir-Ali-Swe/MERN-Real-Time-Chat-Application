export const createFormData = (data) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
        if (data[key] !== undefined && data[key] !== null) {
            formData.append(key, data[key]);
        }
    });
    return formData;
};

export const handleImagePreview = (file, setPreviewCallback) => {
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            if (setPreviewCallback) setPreviewCallback(reader.result);
        };
        reader.readAsDataURL(file);
    }
};
