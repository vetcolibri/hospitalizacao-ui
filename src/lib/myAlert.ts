export function myAlert(title: string, error?: Object) {
    const dialog = document.createElement('dialog');
    dialog.setAttribute('class', 'my-alert');

    const errorDetails = error ? JSON.stringify(error, null, 2) : '';

    dialog.innerHTML = `
        <h2>${title}</h2>

        <textarea readonly>${errorDetails}</textarea>

        <button>Fechar</button>

        <style>
            .my-alert {
                background: white;
                padding: 20px;
                border-radius: 1rem;
                max-width: 500px;
                width: 100%;
            }
            
            .my-alert::backdrop {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.75);
                display: flex;
                justify-content: center;
                align-items: center;
            }
            
            .my-alert h2 {
                margin-top: 0;
            }

            .my-alert textarea {
                width: 100%;
                height: 150px;
                margin-top: 1.5rem;
                display: none;
            }

            .my-alert button {
                margin-top: 1.5rem;
                padding: 0.5rem 1rem;
                background: #007bff;
                color: white;
                border: none;
                border-radius: 0.25rem;
                cursor: pointer;
            }

            .my-alert button:hover {
                background: #0056b3;
            }
        </style>
    `;

    const textarea = dialog.querySelector('textarea')!;
    textarea.style.display = error ? 'block' : 'none';

    const button = dialog.querySelector('button')!;
    button.onclick = () => {
        dialog.close();
        document.body.removeChild(dialog);
    };

    document.body.appendChild(dialog);
    dialog.showModal();
}
