# Procesamiento de Transacciones Bancarias (CLI)

## Introducción

Este proyecto es mi solución al reto técnico de Codeable. Desarrollé una aplicación de línea de comandos usando JavaScript (Node.js) que procesa un archivo CSV con transacciones bancarias y genera un reporte con el balance final, la transacción de mayor monto y el conteo por tipo.

## Instrucciones de Ejecución

1. Me aseguré de que Node.js esté instalado en el sistema.

2. Uso un archivo llamado `data.csv` en la raíz del proyecto con el siguiente formato:

   ```
   id,tipo,monto
   1,Crédito,100.00
   2,Débito,50.00
   3,Crédito,200.00
   4,Débito,75.00
   5,Crédito,150.00
   ```

3. Para ejecutar la aplicación, utilizo este comando:

   ```bash
   node index.js
   ```

## Enfoque y Solución
El código que compartí es mi solución para procesar transacciones bancarias desde un archivo CSV y generar un reporte con el balance final, la transacción de mayor monto y el conteo de transacciones por tipo (Crédito o Débito). Aquí te explico cómo funciona cada parte:

1. **Lectura del archivo CSV:** Uso `fs.readFileSync` para leer el archivo `data.csv` y luego lo proceso línea por línea, ignorando la primera línea (encabezados).
2. **Procesamiento de Transacciones:**
   - Sumo los montos de las transacciones de tipo "Crédito" y resto los de tipo "Débito".
   - Identifico la transacción con el monto más alto.
   - Llevo un conteo de cuántas transacciones son de tipo "Crédito" y cuántas de tipo "Débito".
3. **Validación de Transacciones:** Verifico que cada línea tenga un ID, tipo y monto válidos antes de procesarla. Si alguna transacción no es válida, la ignoro.
4. **Generación del Reporte:** Imprimo un reporte en consola con el balance final, la transacción de mayor monto y el conteo de transacciones por tipo.


## Estructura del Proyecto

```
├── data.csv     # Archivo de entrada con las transacciones bancarias
├── index.js     # Archivo principal con la lógica de procesamiento
└── README.md    # Documentación del proyecto
```

## Código principal (index.js)

```javascript
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

```