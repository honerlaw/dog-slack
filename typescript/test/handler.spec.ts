import * as chai from 'chai';
import {list, random} from '../src/handler';

describe('IT: handler', () => {

	describe('IT: random', () => {

		it('should get a random image of any breed', async () => {
			const resp: any = await random();

			chai.expect(resp).to.have.property('text');
			chai.expect(resp.text.length > 0).to.be.true;
		});

		it('should get a random image of a specific breed', async () => {
			const resp: any = await random('AFFENPINSCHER');

			chai.expect(resp).to.have.property('text');
			chai.expect(resp.text.length > 0).to.be.true;
		});

	});

	describe('IT: list', () => {

		it('should get a list of breeds back', async () => {
			const resp: any = await list();

			chai.expect(resp).to.have.property('text');
			chai.expect(resp.text.length > 0).to.be.true;
		});

	});

});