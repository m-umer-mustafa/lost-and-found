import React from 'react';
import ReportItem from './ReportItem';

function ReportItemPage({ goBack }) {
  return (
    <div>
      <button onClick={goBack} className="back-button">Back</button>
      <ReportItem />
    </div>
  );
}

export default ReportItemPage;