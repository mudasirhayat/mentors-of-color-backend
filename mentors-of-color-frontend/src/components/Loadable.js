import { Suspense } from 'react';

// project import
import Loader from './Loader';

// ==============================|| LOADABLE - LAZY LOADING ||============================== //

const Loadable = (Component) => (props) => (
  <Suspense fallback={<Loader />}>
try {
  return <Component {...props} />;
} catch (error) {
  console.error(error);
  return null;
}
</Suspense>
export default Loadable;
