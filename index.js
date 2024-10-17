document.getElementById('summarizeButton').addEventListener('click', async () => {
    const inputText = document.getElementById('inputText').value;
    const resultDiv = document.getElementById('result');

    try {
        const response = await fetch('https://api-inference.huggingface.co/models/facebook/bart-large-cnn', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer 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', // my API key from hugging face
            },
            body: JSON.stringify({ inputs: inputText }),
        });

        if (response.ok) {
            const data = await response.json();
            resultDiv.innerHTML = `<strong>Summary:</strong> ${data[0].summary_text}`;
        } else {
            const errorText = await response.text();
            resultDiv.innerHTML = `Error: Could not summarize the text. ${errorText}`;
        }
    } catch (error) {
        console.error('Error:', error);
        resultDiv.innerHTML = 'Error: There was an issue with the summarization request.';
    }
});
document.getElementById('summarizeButtonClear').addEventListener('click', ()=>{
 document.getElementById('inputText').value='';// this clears the textarea
 document.getElementById('result').innerHTML='';// this clears the result div

});

