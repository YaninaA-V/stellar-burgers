import * as orderFixture from "../fixtures/order.json";

describe('Добавление ингредиента из списка ингредиентов в конструктор', () => {
    beforeEach(() => {
        cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients'}).as('getIngredients');
        cy.visit('/');
        cy.wait('@getIngredients');
    });

    it('доступен список ингредиентов для выбора', function() {
        cy.get('[data-ingredient="bun"]').should('have.length.at.least', 1); 
        cy.get('[data-ingredient="main"]').should('have.length.at.least', 1); 
        cy.get('[data-ingredient="sauce"]').should('have.length.at.least', 1);         
    });
}); 

describe('Тестирование модального окна', () => {
    beforeEach(() => {
        cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients'});
        cy.visit('/');
      });
    describe ('Открытие модального окна', () =>{
        it('открытие при клике на карточку ингредиента', () => {
            cy.get('[data-ingredient="bun"]:first-of-type').click();
            cy.get('#modals').should('contain', 'Краторная булка N-200i'); 
            cy.get('#modals [data-testid="calories"]').should('contain', '420');
            cy.get('#modals').children().should('have.length', 2);
        });

        it('открытие при клике на карточку ингредиента после перезагрузки', () => {
            cy.get('[data-ingredient="bun"]:first-of-type').click();
            cy.reload(true);
            cy.get('#modals').children().should('have.length', 2);
        });
    });

    describe ('Закрытие модального окна', () =>{
        it('закрытие модального окна через крестик', () => {
            cy.get('[data-ingredient="bun"]:first-of-type').click();
            cy.get('#modals button:first-of-type').click();
            cy.get('#modals').children().should('have.length', 0);
        });

        it('закрытие модального окна через оверлей', () => {
            cy.get('[data-ingredient="bun"]:first-of-type').click();
            cy.get('[data-testid="modal-overlay"]')
            .click({force: true})
            .should('not.exist');
            cy.get('#modals').children().should('have.length', 0);
        });
    });
}); 

describe ('Оформление заказа', () =>{
    beforeEach(() => {
        cy.setCookie('accessToken', 'EXAMPLE_ACCESS_TOKEN');
        localStorage.setItem('refreshToken', 'EXAMPLE_REFRESH_TOKEN');

        cy.intercept('GET', 'api/auth/user', {fixture: 'user'});
        cy.intercept('POST', 'api/orders', {fixture: 'order'});
        cy.intercept('GET', 'api/ingredients', {fixture: 'ingredients'});

        cy.visit('/');
    });
    it('оформление заказа', () => {
        cy.get('[data-order-button]').should('be.disabled');
        cy.get('[data-ingredient="bun"]:first-of-type button').click();
        cy.get('[data-order-button]').should('be.disabled');
        cy.get('[data-ingredient="main"]:first-of-type button').click();
        cy.get('[data-order-button]').should('be.enabled');

        cy.get('[data-order-button]').click();

        cy.get('#modals').children().should('have.length', 2);

        cy.get('#modals h2:first-of-type').should(
            'have.text',
            orderFixture.order.number
          );
    });

    afterEach(() => {
        cy.clearCookie('accessToken');
        localStorage.removeItem('refreshToken');         
    })
});
