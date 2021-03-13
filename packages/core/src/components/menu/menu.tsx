import React, { VFC } from 'react';
import { getNameForEditorMaterial } from '../../helpers/shaderToMaterial';
import { editorState } from '../../state';

import { editorContext } from '../..';

interface SubMenuProps {
  program: any;
}

export const Menu: VFC<SubMenuProps> = ({ program }) => {
  const material = program.material;
  const programGl = program.program;
  if (!programGl) {
    return null
  }
  const name = getNameForEditorMaterial(material, programGl)

  const hide = (e: any) => {
    e.stopPropagation();
    
    // TODO PP LIBS renderToScreen or pass.enabled
    material.visible = !material.visible;
    material.enabled = !material.enabled;
    material.needsUpdate = true;
    editorState.triggerUpdate++;
  };

  const showUniforms = (e: any) => {
    e.stopPropagation();
    console.log(e)
    const value = {
      type: '',
      open: true,
      isModif: false,
      model: `urn:${name}`
    };
  
    editorState.activeMaterial = value;
    editorContext.activeMaterialRef[value.model] = program;

    editorState.showUniforms = true
    editorState.triggerUpdate++;
  };

  return programGl && material ? (
      <div onClick={(e) => {showUniforms(e)}}>
        <span className="uppercase text-base tracking-wide text-blue-darker">{name}</span>
        {material && material.numberOfMaterialsUser > 1 && (
          <span>
            <small>{material.numberOfMaterialsUser}</small>
          </span>
        )}
        {(material && !material.visible && !material.isEffect ? (
          <span onClick={hide} />
        ) : (
          <span onClick={hide} />
        ))}
    </div>
  ) : null;
};