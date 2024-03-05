
import React, { useEffect } from 'react';

export default function Dream({ getImage, getGptResponse, imageUrl, gptResponse, setImageUrl, savedItems, setSavedItems, deleteItem }) {
    const [topText, setTopText] = React.useState('');
    const [bottomText, setBottomText] = React.useState('');
    const [defaultText, setDefaultText] = React.useState('Default Text');
    const [defaultImageUrl, setDefaultImageUrl] = React.useState('default-image.jpg');

    useEffect(() => {
        setDefaultText('Dreams can provide valuable insights into our subconscious thoughts, emotions, and desires.');
        setDefaultImageUrl('https://images.unsplash.com/photo-1709486511766-76bdd8b51713?q=80&w=3189&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');
    }, []);

   
    const interpretationMethods = [
        { value: 'empty', label: "Choose one interpretation methods" },
        { value: 'freud', label: "Freud's Psychoanalytic Approach(弗洛伊德)" },
        { value: 'adler', label: "Adler's Individual Psychology(阿德勒)" },
        { value: 'zhougong', label: "Zhou Gong's Dream Interpretation(周公解梦)" },
        { value: 'taoist', label: "Taoist Dream Interpretation（道教解梦)" },
        { value: 'jung', label: "Jung's Analytical Psychology（荣格)" },
    ];

    function handleGeneration() {
        const promptText = bottomText.trim();
        const topPrompt = topText.trim();
        if (topPrompt === '') {
            alert('Please select a method.');
            return;
        }
        getGptResponse(topPrompt,promptText);
        
        console.log('Prompt text after trim:', promptText);
        if (promptText === '') {
            alert('Please enter a description for your dream.');
            return;
        }

        getImage(promptText);
    }

    function formatResponse(response) {
        return response.split('\n').join('<br>');
      }

    return (
        <main>
            <form className="form">
                <div>
                    <label className="form--label">Select Way of Interpretation</label>
                    <select 
                        className="form--input"
                        value={topText}
                        onChange={(e) => setTopText(e.target.value)}
                    >
                        {interpretationMethods.map(method => (
                            <option key={method.value} value={method.value}>{method.label}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="form--label">Describe your dream</label>
                    <input 
                        type="text" 
                        placeholder="Write as specific as possible"
                        className="form--input"
                        value={bottomText}
                        onChange={(e) => setBottomText(e.target.value)} 
                    />
                </div>
                <button className="form--button" type="button" onClick={handleGeneration}>
                    Why do you dream about this?
                </button>
            </form>
            <div className="form--output-container">
                <div className="form--output-text">
                {!gptResponse && <div dangerouslySetInnerHTML={{ __html: defaultText }} />}
                {gptResponse && <div dangerouslySetInnerHTML={{ __html: formatResponse(gptResponse) }} />}
                </div>
                <div className="form--output-image">
                {!imageUrl && <img src={defaultImageUrl} alt="Default Image" style={{ maxWidth: '250px', maxHeight: '250px' }} />}
                {imageUrl && <img src={imageUrl} alt="Dream Image" style={{ maxWidth: '250px', maxHeight: '250px' }} />}
                </div>
            </div>
            <div className="Dream--storage">
            <table>
            <thead>
                <tr>
                <th>Description</th>
                <th>Timestamp</th>
                <th>Image</th>
                <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {savedItems.map((item, index) => (
                <tr key={index}>
                    <td>{item.description}</td>
                    <td>{new Date(item.timestamp).toLocaleDateString('en-CA')}</td> 
                    <td>
                    <img src={item.imageUrl} alt="Saved dream" style={{ maxWidth: '100px', maxHeight: '100px' }} />
                    </td>
                    <td>
                    <button onClick={() => deleteItem(index)}>Delete</button>
                </td>
                </tr>
                ))}
            </tbody>                    
        </table>
        
            </div>
        </main>
    );
}
