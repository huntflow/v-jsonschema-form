import initStoryshots from '@storybook/addon-storyshots';
import { imageSnapshot } from '@storybook/addon-storyshots-puppeteer';
import registerRequireContextHook from 'babel-plugin-require-context-hook/register';

registerRequireContextHook();

const beforeScreenshot = () => {
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve();
    }, 100)
  );
};

initStoryshots({
  suite: 'Image storyshots',
  test: imageSnapshot({
    storybookUrl: 'http://localhost:6007',
    beforeScreenshot
  })
});
