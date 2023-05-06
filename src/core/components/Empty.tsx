import Result from 'core/components/Result';
import { ReactComponent as EmptySvg } from 'assets/empty.svg';

type EmptyProps = {
  message?: string;
  title: string;
};

const Empty = ({ message, title }: EmptyProps) => {
  return <Result image={<EmptySvg />} subTitle={message} title={title} />;
};

export default Empty;
