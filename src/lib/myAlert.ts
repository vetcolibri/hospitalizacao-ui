export function myAlert(title: string, error?: Object) {
    const dialog = document.createElement('dialog');
    dialog.setAttribute('class', 'my-alert');

    const errorDetails = error ? JSON.stringify(error, null, 2) : '';

    dialog.innerHTML = `
        <h2 class="text-xl my-4">${title}</h2>

        <textarea readonly>${errorDetails}</textarea>

        <center>
            <button class="btn btn-success space-x-2">Fechar</button>
        </center>

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

            .my-alert textarea {
                width: 100%;
                height: 150px;
                margin-top: 1.5rem;
                margin-bottom: 1.5rem;
                display: none;
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
