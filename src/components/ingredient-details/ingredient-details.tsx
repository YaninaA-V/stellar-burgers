import { FC, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from '../../services/store';

export const IngredientDetails: FC = () => {
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (!params.id) {
      navigate('/', { replace: true });
    }
  }, []);
  const ingredientData = useSelector((state) =>
    state.ingredient.buns
      .concat(state.ingredient.mains)
      .concat(state.ingredient.sauces)
      .find((ingredient) => ingredient._id === params.id)
  );

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
