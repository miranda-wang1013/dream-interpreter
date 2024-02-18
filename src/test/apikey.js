const API_KEY = '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'; // 替换为你的 API Key
const url = 'https://api.openai.com/v1/engines';

const options = {
  method: 'GET',
  headers: {
    Authorization: `Bearer ${API_KEY}`,
    'Content-Type': 'application/json',
  }
};

fetch(url, options)
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to fetch');
    }
    return response.json();
  })
  .then(data => {
    console.log('API Key is valid');
    console.log('Engines:', data.engines); // 输出 API 返回的引擎列表
  })
  .catch(error => {
    console.error('API Key is invalid or there was an error:', error);
  });
