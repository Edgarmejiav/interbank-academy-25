const fs = require('fs');

/**
 * Lee el archivo CSV, procesa las transacciones y genera un reporte.
 */
function generateTransactionReport(filePath) {
    const data = readCsvFile(filePath);

    const transactionSummary = processTransactions(data);
    printTransactionReport(transactionSummary);
}

/**
 * Lee el archivo CSV y devuelve un array de transacciones.
 */
function readCsvFile(filePath) {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const lines = fileContent.split('\n').slice(1); // Ignora la primera línea (encabezados)

    return lines.map(line => parseTransactionLine(line));
}

/**
 * Parsea una línea del CSV y devuelve un objeto con los datos de la transacción.
 */
function parseTransactionLine(line) {
    const [id, type, amountStr] = line.trim().split(',');

    return {
        id,
        type,
        amount: parseFloat(amountStr)
    };
}

/**
 * Procesa las transacciones y devuelve un resumen con el balance final,
 * la transacción de mayor monto y el conteo por tipo.
 * @param {Array} transactions - Array de transacciones.
 */
function processTransactions(transactions) {
    let balance = 0;
    let maxAmount = 0;
    let maxTransactionId = null;
    let creditCount = 0;
    let debitCount = 0;

    for (const transaction of transactions) {
        if (!isValidTransaction(transaction)) continue;

        if (transaction.amount > maxAmount) {
            maxAmount = transaction.amount;
            maxTransactionId = transaction.id;
        }

        if (transaction.type === 'Crédito') {
            balance += transaction.amount;
            creditCount++;
        } else if (transaction.type === 'Débito') {
            balance -= transaction.amount;
            debitCount++;
        }
    }

    return {
        balance,
        maxTransaction: { id: maxTransactionId, amount: maxAmount },
        transactionCount: { credit: creditCount, debit: debitCount }
    };
}

/**
 * Verifica si la transacción es válida.
 *
 * Una transacción es válida si:
 * 1. Tiene un `id` no vacío.
 * 2. Tiene un `type` (tipo) no vacío.
 * 3. El `amount` (monto) es un número válido.
 * @param {Object} transaction - Objeto de transacción.
 */
function isValidTransaction(transaction) {
    return transaction.id && transaction.type && !isNaN(transaction.amount);
}

/**
 * Imprime el reporte de las transacciones en la consola.
 */
function printTransactionReport({ balance, maxTransaction, transactionCount }) {
    console.log('Reporte de Transacciones');
    console.log('---------------------------------------------');
    console.log(`Balance Final: ${balance.toFixed(2)}`);
    console.log(`Transacción de Mayor Monto: ID ${maxTransaction.id} - ${maxTransaction.amount.toFixed(2)}`);
    console.log(`Conteo de Transacciones: Crédito: ${transactionCount.credit} Débito: ${transactionCount.debit}`);
}

// Ejecutar el reporte de transacciones
generateTransactionReport('data.csv');
