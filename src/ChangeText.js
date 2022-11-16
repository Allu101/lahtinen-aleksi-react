import { React, useState, useEffect, useCallback } from 'react';

export default function ChangeText() {
  const names = ['foo', 'bar'];
  const [text, setText] = useState('foo');
  let i = 0;

  const shuffle = useCallback(() => {
    i = (i + 1) % 2;
    setText(names[i]);
  }, []);

  useEffect(() => {
    const intervalID = setInterval(shuffle, 2000);
    return () => clearInterval(intervalID);
  }, [shuffle]);

  return <p>{text}</p>;
}
