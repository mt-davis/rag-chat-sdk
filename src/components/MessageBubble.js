export default function MessageBubble({ content, role }) {
    return (
      <div className={`p-2 rounded-lg max-w-[80%] ${role === 'user' ? 'ml-auto bg-blue-100' : 'mr-auto bg-gray-200'}`}>
        {content}
      </div>
    );
  }
  