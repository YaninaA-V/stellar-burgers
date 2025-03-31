import { useDispatch, useSelector } from '../../services/store';

import styles from './constructor-page.module.css';

import { BurgerIngredients } from '../../components';
import { BurgerConstructor } from '../../components';
import { Preloader } from '../../components/ui';
import { FC, useEffect } from 'react';
import { getIngredient } from '../../services/ingredients/ingredients-slice';
import { fetchIngredient } from '../../services/ingredients/ingredients-actions';

export const ConstructorPage: FC = () => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector(getIngredient);

  useEffect(() => {
    dispatch(fetchIngredient());
  }, [dispatch]);

  const isIngredientsLoading = useSelector(
    (state) => state.ingredient.isLoading
  );

  return (
    <>
      {isIngredientsLoading ? (
        <Preloader />
      ) : (
        <main className={styles.containerMain}>
          <h1
            className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}
          >
            Соберите бургер
          </h1>
          <div className={`${styles.main} pl-5 pr-5`}>
            <BurgerIngredients />
            <BurgerConstructor />
          </div>
        </main>
      )}
    </>
  );
};
