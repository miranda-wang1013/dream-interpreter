import React from "react"
import OpenAI from "openai"
import Header from "./components/Header"
import Dream from "./components/Dream"

export default function App() {
    const [imageUrl, setImageUrl] = React.useState('');
    const [gptResponse, setGptResponse] = React.useState('');
    const [savedItems, setSavedItems] = React.useState([]);
    const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

    React.useEffect(() => {
        const loadedItems = localStorage.getItem('savedItems');
        if (loadedItems) {
            setSavedItems(JSON.parse(loadedItems));
        }
    }, []);

    async function getImage(promptText) {

    const options = {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: 'dall-e-2',
            prompt: `draw a picture of my dream, magical style, ${promptText}`,
            n: 1,
            size: '512x512',
        }),
    };
    console.log(`Using API Key: ${API_KEY}`); // Add this line

    try {
        const response = await fetch('https://api.openai.com/v1/images/generations', options);
        const data = await response.json();
        console.log(data);
        if (data.data && data.data.length > 0) {
            const imageUrl = data.data[0].url;
            const timestamp = new Date().toISOString();
            const newItem = { timestamp, description: promptText, imageUrl };
            const newSavedItems = [...savedItems, newItem];
                setImageUrl(imageUrl);
                setSavedItems(newSavedItems);
                localStorage.setItem('savedItems', JSON.stringify(newSavedItems));
            } else {
            alert('Failed to get image from OpenAI.');
        }
    } catch (error) {
        console.error(error);
        alert('An error occurred while fetching the image.');
    }
}
async function getGptResponse(topPrompt, promptText) {
    const options = {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
                {"role": "system", "content": `Interpret the dream from the perspective of ${topPrompt}, the dream is about ${promptText}.\nPlease provide the following information:\nPsychological reasons behind the dream: [Based on the content of the dream, provide possible psychological reasons behind it.]\nStress index: [Based on the content of the dream and its psychological interpretation, provide a stress index assessment.]\nRecommended actions:\n1. [Based on the interpretation of the dream, provide the first recommended activity or behavior.]\n2. [Provide the second recommended activity or behavior.]]
                `},
                {"role": "user", "content": `The dream is about ${promptText}.`}
            ],
        }),
    };

    console.log('API Request:', options);
    console.log(topPrompt);
    console.log(promptText);

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', options);
        const data = await response.json();
        console.log('GPT-3 Response:', data);
        if (data.choices && data.choices.length > 0) {
            const textResponse = data.choices[0].message.content.trim(); // Adjusted to access message content
            console.log('Text Response:', textResponse);
            setGptResponse(textResponse);
        } else {
            alert('Failed to get response from OpenAI.');
        }
    } catch (error) {
        console.error('GPT-3 Error:', error);
        alert('An error occurred while fetching the GPT-3 response.');
    }
}

function deleteItem(index) {
    const filteredItems = savedItems.filter((_, itemIndex) => itemIndex !== index);
    setSavedItems(filteredItems);
    localStorage.setItem('savedItems', JSON.stringify(filteredItems));
}

    return (
        <div>
            <Header />
            <Dream getImage={getImage} getGptResponse={getGptResponse} imageUrl={imageUrl} gptResponse={gptResponse} savedItems={savedItems} setSavedItems={setSavedItems} deleteItem={deleteItem}/>

        </div>
    );
}