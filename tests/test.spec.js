import { mount } from '@vue/test-utils';
import Vjsf from '../src/components/Form';
import simpleData from '../src/components/Form.stories.data/simple';

test('mount component', async () => {
  expect(Vjsf).toBeTruthy();
  const wrapper = mount(Vjsf, {
    props: {
      ...simpleData
    }
  });
  expect(wrapper.html()).toMatchSnapshot();
});
