import React from 'react';
import FundRaise from './FundRaise';

export default {
  title: 'Pages/FundRaise',
  component: FundRaise
};

const Template = (args) => <FundRaise {...args}/>;

export const FundRaiseStory = Template.bind({});
FundRaiseStory.args = {
  title: 'First Fundraiser',
  id: 0,
  description: 'This is my first fund raiser for my dApp idea',
  current: 500,
  goal: 3000
};