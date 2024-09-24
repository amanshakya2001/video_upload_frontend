const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB chunk size (adjust as needed)

async function uploadFile() {
  const file = document.getElementById('fileInput').files[0];
  if (!file) {
    alert('Please select a file first.');
    return;
  }

  const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
  let currentChunk = 0;
  const uploadProgress = document.getElementById('uploadProgress');

  while (currentChunk < totalChunks) {
    const start = currentChunk * CHUNK_SIZE;
    const end = Math.min(start + CHUNK_SIZE, file.size);
    const chunk = file.slice(start, end);

    const formData = new FormData();
    formData.append('file', chunk);
    formData.append('chunkIndex', currentChunk);
    formData.append('totalChunks', totalChunks);
    formData.append('fileName', file.name);

    // Send chunk to the server
    const response = await uploadChunk(formData);

    // If this is the final chunk, log the file URL
    if (response.status === 'complete') {
      console.log('File URL:', response.fileUrl);
    }

    // Update progress
    currentChunk++;
    uploadProgress.value = (currentChunk / totalChunks) * 100;
  }

  alert('Upload complete!');
}

async function uploadChunk(formData) {
  try {
    const response = await fetch('https://video-upload-8jt2.onrender.com/upload/', {
      method: 'POST',
      body: formData,
    });

    // Return the JSON response
    return await response.json();
  } catch (error) {
    console.error('Chunk upload failed:', error);
    throw error;
  }
}
