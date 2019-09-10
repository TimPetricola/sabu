export function login() {
  return `<?xml version="1.0"?>
    <methodCall>
      <methodName>LogIn</methodName>
      <params>
        <param>
          <value>
            <string></string>
          </value>
        </param>
        <param>
          <value>
            <string></string>
          </value>
        </param>
        <param>
          <value>
            <string>en</string>
          </value>
        </param>
        <param>
          <value>
            <string>OpenSubtitlesPlayer v4.7</string>
          </value>
        </param>
      </params>
    </methodCall>`;
}

export function logout({ token }: { token: string }) {
  return `<?xml version="1.0"?>
    <methodCall>
      <methodName>LogOut</methodName>
      <params>
        <param>
          <value>
            <string>${token}</string>
          </value>
        </param>
      </params>
    </methodCall>`;
}

export function search({
  token,
  lang,
  params = {}
}: {
  token: string;
  lang: string;
  params?: { [k: string]: string };
}) {
  let paramsXml = "";

  for (var key in params) {
    if (params.hasOwnProperty(key)) {
      paramsXml += `
        <member>
          <name>${key}</name>
          <value>
            <string>${params[key]}</string>
          </value>
        </member>
      `;
    }
  }

  return `<?xml version="1.0"?>
    <methodCall>
      <methodName>SearchSubtitles</methodName>
      <params>
        <param>
          <value>
            <string>${token}</string>
          </value>
        </param>
        <param>
          <value>
            <array>
              <data>
                <value>
                  <struct>
                    <member>
                      <name>sublanguageid</name>
                      <value>
                        <string>${lang}</string>
                      </value>
                    </member>
                    ${paramsXml}
                  </struct>
                </value>
              </data>
            </array>
          </value>
        </param>
      </params>
    </methodCall>`;
}
