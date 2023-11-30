import { Wall } from './Wall.js';
import { GoalZone } from './GoalZone.js';
import {
	BoxGeometry,
	Mesh,
	MeshBasicMaterial,
	MeshStandardMaterial,
	Vector3
} from 'three';

class Terrain {
	constructor(size, lineWidth, margin) {
		const g_lineh = new BoxGeometry(size.x - margin * 2, lineWidth, 2);
		const g_linev = new BoxGeometry(lineWidth, size.y - margin * 2, 2);
		const m_white = new MeshStandardMaterial({ color: 'white' });
		this.wallTop = new Wall(g_lineh, m_white);
		this.wallTop.position.set(0, (size.y / 2 - margin - lineWidth / 2), 0);
		this.wallBot = new Wall(g_lineh, m_white);
		this.wallBot.position.set(0, -(size.y / 2 - margin - lineWidth / 2), 0);
		this.leftGoalZone = new GoalZone(g_linev, m_white, 1);
		this.leftGoalZone.position.set(-(size.x / 2 - margin - lineWidth / 2), 0, 0);
		this.rightGoalZone = new GoalZone(g_linev, m_white, 2);
		this.rightGoalZone.position.set(size.x / 2 - margin - lineWidth / 2, 0, 0);
	}

	delete() {
		this.wallTop.delete();
		this.wallBot.delete();
		this.leftGoalZone.delete();
		this.rightGoalZone.delete();
	}
}

export { Terrain };