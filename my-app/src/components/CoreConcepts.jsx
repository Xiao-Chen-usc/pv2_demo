import React, { useState } from 'react';

export default function CoreConcepts() {
  const [formData, setFormData] = useState({
    s3_data: '',
    s3_label: '',
    s3_dispensed_pill: '',
    s3_observed_pill: ''
  });

  function splitLongString(str, maxLength) {
    const regex = new RegExp(`.{1,${maxLength}}`, 'g');
    return str.match(regex).join('\n');
  }

  const [outputData, setOutputData] = useState('');
  const [isLoading, setIsLoading] = useState(false); 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const callAPI = () => {
    setIsLoading(true);
    fetch('https://g9ultkdwxe.execute-api.us-west-2.amazonaws.com/dev', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
      .then(response => {
        console.log('Response:', response);
        console.log('formData:', formData);
        return response.json();
      })
      .then(data => {
        console.log('Data:', data);
        const formattedResponse = splitLongString(JSON.stringify(data, null, 2), 100); 
        setOutputData(formattedResponse);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error:', error);
        setIsLoading(false);
      });
  };

  return (
    <section id="core-concepts">
      <h2>AI powered PV2 copilot</h2>
      <div>
        <label htmlFor="s3Data">S3 Data:</label>
        <input type="text" id="s3Data" name="s3_data" value={formData.s3_data} onChange={handleChange} />
      </div>
      <div>
        <label htmlFor="s3Label">S3 Label:</label>
        <input type="text" id="s3Label" name="s3_label" value={formData.s3_label} onChange={handleChange} />
      </div>
      <div>
        <label htmlFor="s3DispensedPill">S3 Dispensed Pill:</label>
        <input type="text" id="s3DispensedPill" name="s3_dispensed_pill" value={formData.s3_dispensed_pill} onChange={handleChange} />
      </div>
      <div>
        <label htmlFor="s3ObservedPill">S3 Observed Pill:</label>
        <input type="text" id="s3ObservedPill" name="s3_observed_pill" value={formData.s3_observed_pill} onChange={handleChange} />
      </div>
      <div>
        <button onClick={callAPI} disabled={isLoading}>Call API</button> 
        {isLoading && <span>Waiting...</span>} 
      </div>
      {outputData && (
        <div>
          <h3>API Response:</h3>
          <div style={{ maxHeight: '600px', overflowY: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
            <pre>{outputData}</pre>
          </div>
        </div>
      )}
    </section>
  );
}