import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { getFeeds } from '../../services/feed/feed-slice';
import { fetchFeeds } from '../../services/feed/feed-actions';

export const Feed: FC = () => {
  const orders = useSelector(getFeeds);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchFeeds());
  }, [dispatch]);

  const handleUpdateFeeds = () => {
    dispatch(fetchFeeds());
  };

  if (!orders.feed?.orders) {
    return <Preloader />;
  }

  return (
    <FeedUI orders={orders.feed.orders} handleGetFeeds={handleUpdateFeeds} />
  );
};
