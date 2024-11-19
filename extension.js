const vscode = require('vscode');
const axios = require('axios');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    let disposable = vscode.commands.registerCommand('rupeesToDollars.convert', async () => {
        // Get user input for the amount in rupees
        const input = await vscode.window.showInputBox({
            prompt: "Enter the amount in INR (Rupees)",
            placeHolder: "E.g., 1000"
        });

        if (!input || isNaN(input)) {
            vscode.window.showErrorMessage("Please enter a valid number.");
            return;
        }

        const amountInRupees = parseFloat(input);

        // Fetch the exchange rate using an API
        try {
            const response = await axios.get('https://api.exchangerate-api.com/v4/latest/INR');
            const exchangeRate = response.data.rates.USD;

            if (exchangeRate) {
                const convertedAmount = (amountInRupees * exchangeRate).toFixed(2);
                vscode.window.showInformationMessage(
                    `${amountInRupees} INR is approximately ${convertedAmount} USD.`
                );
            } else {
                throw new Error("Exchange rate not found.");
            }
        } catch (error) {
            vscode.window.showErrorMessage(
                "Failed to fetch exchange rate. Please try again later."
            );
        }
    });

    context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};
