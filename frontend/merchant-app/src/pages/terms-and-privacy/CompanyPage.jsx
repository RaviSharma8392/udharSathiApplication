function CompanyPage() {
  return (
    <div>
      <h1 className="text-xl font-bold mb-2">About UdhaarSathi</h1>
      <p className="text-gray-700 text-sm">
        UdhaarSathi is a simple, trusted app built for kirana shopkeepers to
        manage daily udhaar and payments efficiently.
        <br />
        <br />
        Key Features:
        <ul className="list-disc ml-5 mt-2">
          <li>Offline-first design using IndexedDB</li>
          <li>Automatic cloud backup</li>
          <li>Multi-language support (Hindi, Hinglish, English)</li>
          <li>Simple subscription system with data safety</li>
        </ul>
        <br />
        Our mission is to make small business bookkeeping simple, reliable, and
        trustworthy.
      </p>
    </div>
  );
}
export default CompanyPage;
