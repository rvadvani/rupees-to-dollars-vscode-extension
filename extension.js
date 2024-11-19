const vscode = require('vscode');
const axios = require('axios');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    // Command to convert Rupees to Dollars
    let rupeesToDollarsCommand = vscode.commands.registerCommand('rupeesToDollars.convert', async () => {
        const input = await vscode.window.showInputBox({
            prompt: "Enter the amount in INR (Rupees)",
            placeHolder: "E.g., 1000"
        });

        if (!input || isNaN(input)) {
            vscode.window.showErrorMessage("Please enter a valid number.");
            return;
        }

        const amountInRupees = parseFloat(input);

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

    // Command to convert Dollars to Rupees
    let dollarsToRupeesCommand = vscode.commands.registerCommand('dollarsToRupees.convert', async () => {
        const input = await vscode.window.showInputBox({
            prompt: "Enter the amount in USD (Dollars)",
            placeHolder: "E.g., 50"
        });

        if (!input || isNaN(input)) {
            vscode.window.showErrorMessage("Please enter a valid number.");
            return;
        }

        const amountInDollars = parseFloat(input);

        try {
            const response = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');
            const exchangeRate = response.data.rates.INR;

            if (exchangeRate) {
                const convertedAmount = (amountInDollars * exchangeRate).toFixed(2);
                vscode.window.showInformationMessage(
                    `${amountInDollars} USD is approximately ${convertedAmount} INR.`
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

    context.subscriptions.push(rupeesToDollarsCommand);
    context.subscriptions.push(dollarsToRupeesCommand);
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};
