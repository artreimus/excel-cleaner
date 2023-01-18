import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();
  return (
    <div className="homepage">
      <div className="homepage__container">
        <button
          onClick={() => navigate('/clean/app-one')}
          className="homepage__btn"
        >
          App One
        </button>
      </div>
      <div className="homepage__container">
        <button
          onClick={() => navigate('/clean/app-two')}
          className="homepage__btn"
        >
          App Two
        </button>
      </div>
    </div>
  );
};

export default HomePage;
