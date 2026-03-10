
export default function QuillContent({ html }: { html: string }) {
  return (
    <div
      className="quill-content"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}