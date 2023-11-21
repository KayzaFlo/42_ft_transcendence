import { World } from "../World.js";

class Renderer {
	constructor( obj ) {
		this.obj = obj;
		World.add( this.obj );
	}

	setLayers( ...layers ) {
		this.obj.traverse(function(child) {
			child.layers.disableAll(0);
			layers.forEach(layer => {
				child.layers.enable(layer);
			});
		});
	}

	delete() {
		this.obj.traverse(function(child) {
			child.material.dispose();
			child.geometry.dispose();
		});
		World.remove( this.obj );
	}
}

export { Renderer };
