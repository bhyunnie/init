const bold = (content) => {
  return `**${content}**`;
};

const italic = (content) => {
  return `*${content}*`;
};

const boldAndItalic = (content) => {
  return `***${content}***`;
};

const codeblock = (content) => {
  return "```" + content + "```";
};

const hideAndShow = (content) => {
  return `||${content}||`;
};

const blank = () => {
  return "\u200b";
};

const quote = (content) => {
  return `> ${content}`;
};

const list = (contentArray) => {
  return contentArray
    .map((content) => {
      return `- ${content}`;
    })
    .join("\n");
};

const link = (content) => {
  return `[${content}](${content})`;
};

export default {
  bold,
  italic,
  boldAndItalic,
  codeblock,
  blank,
  hideAndShow,
  quote,
  list,
  link,
};
