import { styled } from './stitches.config';

export const Yogan = styled('div', {
  position: 'absolute',
  fontSize: '13px',
  top: '0',
  right: '0',
  zIndex: 9999,
  border: '0',
  padding: '8px',
  backgroundColor: '#121212'
});

export const Container = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  border: '0'
});

export const YoganElement = styled('div', {
  padding: '4px',
  justifyContent: 'center',
  border: '0',
  color: '#f1f1f1',
  cursor: 'pointer'
});
