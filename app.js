/* add your code here */
/* add your code here */
document.addEventListener('DOMContentLoaded', () => {
    const stocksData = JSON.parse(stockContent); // Loaded from stocks-complete.js
    const userData = JSON.parse(userContent); // Loaded from users.js

    // Initialize user list and register event listeners
    generateUserList(userData, stocksData);

    // Register save and delete button event listeners
    const saveButton = document.querySelector('#save');
    const deleteButton = document.querySelector('#delete');

    saveButton.addEventListener('click', (e) => {
      e.preventDefault();
      const id = document.querySelector('#userID').value;

      // Update user details
      for (let i = 0; i < userData.length; i++) {
        if (userData[i].id == id) {
          userData[i].user.firstname = document.querySelector('#firstname').value;
          userData[i].user.lastname = document.querySelector('#lastname').value;
          userData[i].user.address = document.querySelector('#address').value;
          userData[i].user.city = document.querySelector('#city').value;
          userData[i].user.email = document.querySelector('#email').value;

          generateUserList(userData, stocksData);
          break;
        }
      }
    });

    deleteButton.addEventListener('click', (e) => {
      e.preventDefault();
      const userId = document.querySelector('#userID').value;
      const userIndex = userData.findIndex(user => user.id == userId);

      if (userIndex > -1) {
        userData.splice(userIndex, 1);
        generateUserList(userData, stocksData);
        document.querySelector('form').reset(); // Clear the form
      }
    });
  });

  /**
   * Renders the user list
   * @param {*} users - User data array
   * @param {*} stocks - Stocks data array
   */
  function generateUserList(users, stocks) {
    const userList = document.querySelector('.user-list');
    userList.innerHTML = ''; // Clear the list before rendering

    users.forEach(({ user, id }) => {
      const listItem = document.createElement('li');
      listItem.innerText = `${user.lastname}, ${user.firstname}`;
      listItem.setAttribute('id', id);
      userList.appendChild(listItem);
    });

    // Add event listener to handle user clicks
    userList.addEventListener('click', (event) => handleUserListClick(event, users, stocks));
  }

  /**
   * Handles user list click
   * @param {*} event
   * @param {*} users - User data array
   * @param {*} stocks - Stocks data array
   */
  function handleUserListClick(event, users, stocks) {
    const userId = event.target.id;
    const user = users.find(user => user.id == userId);

    if (user) {
      populateForm(user);
      renderPortfolio(user, stocks);
    }
  }

  /**
   * Populates the form with the selected user's data
   * @param {*} data - User object
   */
  function populateForm(data) {
    const { user, id } = data;

    document.querySelector('#userID').value = id;
    document.querySelector('#firstname').value = user.firstname;
    document.querySelector('#lastname').value = user.lastname;
    document.querySelector('#address').value = user.address;
    document.querySelector('#city').value = user.city;
    document.querySelector('#email').value = user.email;
  }

  /**
   * Renders the portfolio for the selected user
   * @param {*} user - User object
   * @param {*} stocks - Stocks data array
   */
  function renderPortfolio(user, stocks) {
    const { portfolio } = user;
    const portfolioDetails = document.querySelector('.portfolio-list');
    portfolioDetails.innerHTML = ''; // Clear previous render

    portfolio.forEach(({ symbol, owned }) => {
      const symbolEl = document.createElement('p');
      const sharesEl = document.createElement('p');
      const actionEl = document.createElement('button');

      symbolEl.innerText = `Symbol: ${symbol}`;
      sharesEl.innerText = `Shares: ${owned}`;
      actionEl.innerText = 'View';
      actionEl.setAttribute('id', symbol);

      portfolioDetails.appendChild(symbolEl);
      portfolioDetails.appendChild(sharesEl);
      portfolioDetails.appendChild(actionEl);
    });

    portfolioDetails.addEventListener('click', (event) => {
      if (event.target.tagName === 'BUTTON') {
        viewStock(event.target.id, stocks);
      }
    });
  }

  /**
   * Displays stock information for the selected symbol
   * @param {*} symbol - Stock symbol
   * @param {*} stocks - Stocks data array
   */
  function viewStock(symbol, stocks) {
    const stock = stocks.find(s => s.symbol == symbol);
    const stockArea = document.querySelector('.stock-form');

    if (stock) { 
      stockArea.style.display = 'block'; 
      document.querySelector('#stockName').textContent = stock.name;
      document.querySelector('#stockSector').textContent = stock.sector;
      document.querySelector('#stockIndustry').textContent = stock.subIndustry;
      document.querySelector('#stockAddress').textContent = stock.address;
      document.querySelector('#logo').src = `logos/${symbol}.svg`;
    }
  }
