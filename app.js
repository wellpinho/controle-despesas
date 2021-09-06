const transactionsUl = document.querySelector('#transactions')
const incomeDisplay = document.querySelector('#money-plus')
const expensaDisplay = document.querySelector('#money-minus')
const balanceDisplay = document.querySelector('#balance')
const form = document.querySelector('#form')
const inputTrasactionName = document.querySelector('#text')
const inputTrasactionAmount = document.querySelector('#amount')

// salvando dados no localstorage do user
const localStorageTransaction = JSON.parse(localStorage.
  getItem('transactions'))

let transactions = localStorage.
  getItem('transactions') !== null ? 
    localStorageTransaction : []


// btn remove
const removeTransaction = ID => {
  transactions = transactions.filter(transaction => {
    return transaction.id !== ID
  })

  updateLocalstorage()
  init()
}

const addTransactionIntoDOM = transaction => {
  const operator = transaction.amount < 0 ? '-' : '+'
  const CSSClass = transaction.amount < 0 ? 'minus' : 'plus'
  const amountWithoutOperator = Math.abs(transaction.amount)
  const li = document.createElement('li')

  li.classList.add(CSSClass)
  li.innerHTML = `
    ${transaction.name} 
    <span>${operator} R$ ${amountWithoutOperator}</span>
    <button 
      class="delete-btn" 
      onClick="removeTransaction(${transaction.id})"
    >x</button>
  `
  transactionsUl.append(li)
}

// esta com muitas funções qure podem ser fragmentadas
const updateBalanceValues = () => {
  const transactionsAmounts = transactions.map(transaction => {
    return transaction.amount
  })

  // tratando despesas e renda, e dando total de lucro
  const total = transactionsAmounts.reduce((acc, transaction) => {
    return acc + transaction
  }, 0).toFixed(2).replace('.', ',')

  // tratando e somando as rendas
  const income = transactionsAmounts.filter((value) => {
    return value > 0 // cria novo array só com numeros maiores que 37
  }).reduce((acc, value) => {
    return acc + value
  }, 0).toFixed(2)

  // tratando e somando as despesas
  const expense = Math.abs(transactionsAmounts.filter((value) => {
    return value < 0
  }).reduce((acc, value) => acc + value, 0)).toFixed(2).replace('.', ',')

  balanceDisplay.textContent = `R$ ${total}`
  incomeDisplay.textContent = `R$ ${income}`
  expensaDisplay.textContent = `R$ ${expense}`
}

const init = () => {
  transactionsUl.innerHTML = ''
  transactions.forEach(addTransactionIntoDOM)
  updateBalanceValues()
}

init()

const updateLocalstorage = () => {
  localStorage.setItem('transactions', JSON.stringify(transactions))
}

// gerando id aleatório de 0 a 1000
const generateId = () => Math.round(Math.random() * 1000)

// precisa refatorar esta com mais de 3 responsabilidades
form.addEventListener('submit', (event) => {
  event.preventDefault() // impede que a página faço load ao enviar

  const transactionName = inputTrasactionName.value.trim()
  const transactionAmount = inputTrasactionAmount.value.trim()

  // refator, esta um pouco ilegivel
  if (transactionName === '' || transactionAmount === '') {
    // desafio criar um alert direto no página com um li
    alert('Por favor, insira um valor em ambos os inputs')
    return
  }

  const transaction = { 
    id: generateId(), 
    name: transactionName, 
    amount: Number(transactionAmount) 
  }

  transactions.push(transaction)
  init()
  updateLocalstorage()

  inputTrasactionName.value = ''
  inputTrasactionAmount.value = ''
})