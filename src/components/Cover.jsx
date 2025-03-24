import React from 'react';

const Cover = React.forwardRef((props, ref) => {
  return (
    <div ref={ref} className="h-full w-full">
      <div className="h-full w-full bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center p-8">
        {props.children}
      </div>
    </div>
  );
});

export default Cover;