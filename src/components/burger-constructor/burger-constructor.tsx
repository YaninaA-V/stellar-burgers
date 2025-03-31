import { FC, useMemo } from 'react';
import { BurgerConstructorUI } from '@ui';
import { useNavigate } from 'react-router-dom';
import { RootState, useDispatch, useSelector } from '../../services/store';
import { createOrder } from '../../services/order/order-actions';
import { resetModalDataOrder } from '../../services/order/order-slice';
import { createSelector } from '@reduxjs/toolkit';

const selectConstructorItems = createSelector(
  (state: RootState) => state.burgerConstructor,
  (constructorState) => ({
    bun: constructorState.bun,
    ingredients: constructorState.ingredients
  })
);

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { bun, ingredients } = useSelector(selectConstructorItems);

  const { isAuthenticated } = useSelector((state) => state.user);

  const { orderRequest, orderModalData } = useSelector((state) => state.order);

  const onOrderClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!bun || orderRequest) return;

    const data = [
      bun._id,
      ...ingredients.map((ingredient) => ingredient._id),
      bun._id
    ];
    dispatch(createOrder(data));
  };

  const closeOrderModal = () => {
    dispatch(resetModalDataOrder());
  };

  const price = useMemo(() => {
    const bunPrice = bun ? bun.price * 2 : 0;
    const ingredientsPrice = ingredients.reduce(
      (sum, item) => sum + item.price,
      0
    );
    return bunPrice + ingredientsPrice;
  }, [bun, ingredients]);

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
