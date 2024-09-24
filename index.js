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
    await uploadChunk(formData);

    // Update progress
    currentChunk++;
    uploadProgress.value = (currentChunk / totalChunks) * 100;
  }

  alert('Upload complete!');
}

async function uploadChunk(formData) {
  try {
    await fetch('/upload', {
      method: 'POST',
      body: formData,
    });
  } catch (error) {
    console.error('Chunk upload failed:', error);
    throw error;
  }
}
