import React, {VFC} from 'react'
import { Menu } from './components/menu/menu';
import { UniformsMenu } from './components/menu/menuUniforms';
import { editorContext, Props } from './index';
import { editorState } from './state';
import { useSnapshot } from 'valtio';
import { Yogan, Container } from './styles/styles'

export const Gui: VFC<Props> = () => {
  const snapshot = useSnapshot(editorState);
  return editorContext.programs.length > 0 ? (
    <Yogan>
      <Container key={snapshot.triggerUpdate}>
        {editorContext.programs.map((value: any, key: any) => {
          return <Menu program={value} key={key.toString()} />;
        })}
      </Container>
      <UniformsMenu />
    </Yogan>
  ) : null;
};
