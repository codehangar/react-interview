// Inspired By: https://codesandbox.io/embed/r5qmj8m6lq
import React, { useState } from 'react';
import clamp from 'lodash/clamp';
import isEqual from 'lodash/isEqual';
import swap from 'lodash-move';
import { useGesture } from 'react-with-gesture';
import { useSprings, animated, interpolate } from 'react-spring';
import { superFancyEncrypter } from './helpers/decoder.helper';

const superFancyEncryptedMessage = `
Uryyb gurer! Gunaxf sbe chggvat va gur gvzr gb chyy qbja guvf cebwrpg naq eha vg! Vs lbh ner rkpvgrq gb 
pbagvahr gur Ernpg Qrirybcre vagreivrj cebprff jvgu Pbqr Unatne, rznvy hf ng qrif@pbqrunatne.vb jvgu gur 
fhowrpg yvar "Ernpg Qrirybcre Vagreivrj" gb erdhrfg lbhe arkg fgrcf. Cyrnfr vapyhqr lbhe tvguho hfreanzr 
fb jr pna funer n cevingr ercbfvgbel jvgu lbh.
`;

// Returns fitting styles for dragged/idle items
const getItemStyles = (order, down, originalIndex, curIndex, y) => index => {
  return down && index === originalIndex // if mouse down and current item
    ? { y: curIndex * 100 + y, scale: 1.1, zIndex: '1', shadow: 15, immediate: n => n === 'y' || n === 'zIndex' }
    : { y: order.indexOf(index) * 100, scale: 1, zIndex: '0', shadow: 1, immediate: false };
};

export function App(props) {
  const { items, correctOrder } = props;

  // Track the current indices representing the item order
  const [currentOrder, setCurrentOrder] = useState(items.map((item, index) => index));

  // Create springs, each corresponds to an item, controlling its transform, scale, etc.
  const [springs, setSprings] = useSprings(items.length, getItemStyles(currentOrder));

  // Store current order indices as a mutable array, to assist with animating without causing unnecessary re-renders
  let tempOrder = currentOrder;

  const bind = useGesture(({ down, delta, args }) => {
    const [originalIndex] = args;
    const [, y] = delta;
    const curIndex = tempOrder.indexOf(originalIndex);
    const curRow = clamp(Math.round((curIndex * 100 + y) / 100), 0, items.length - 1);
    const newOrder = swap(tempOrder, curIndex, curRow);
    // Feed springs new style data
    setSprings(getItemStyles(newOrder, down, originalIndex, curIndex, y));
    if (!down) {
      tempOrder = newOrder;
      setCurrentOrder(newOrder);
    }
  });


  return (
    <div style={styles.container}>
      <div style={{ ...styles.list, height: items.length * 100 }} className="content">
        {springs.map(({ zIndex, shadow, y, scale }, i) => {
          return (
            <animated.div
              key={i}
              {...bind(i)}
              style={{
                ...styles.item,
                zIndex,
                boxShadow: shadow.interpolate(s => `rgba(0, 0, 0, 0.15) 0px ${s}px ${2 * s}px 0px`),
                transform: interpolate([y, scale], (y, s) => `translate3d(0,${y}px,0) scale(${s})`),
              }}
              children={items[i]}
            />
          );
        })}
      </div>
      {isEqual(currentOrder, correctOrder) && (
        <p style={{ color: 'white', fontSize: 16, fontFamily: 'monospace' }}>
          {superFancyEncrypter(superFancyEncryptedMessage)}
        </p>
      )}
    </div>
  );
}

const styles = {
  container: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: 400,
  },
  list: {
    position: 'relative',
    width: 320,
    height: 240,
  },
  item: {
    position: 'absolute',
    width: 320,
    height: 90,
    overflow: 'visible',
    pointerEvents: 'auto',
    transformOrigin: '50% 50% 0px',
    borderRadius: 5,
    color: '#FFF',
    fontWeight: 600,
    lineHeight: '90px',
    fontSize: 14.5,
    textTransform: 'uppercase',
    textAlign: 'center',
    letterSpacing: 2,
  },
};
