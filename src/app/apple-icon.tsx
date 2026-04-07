import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(135deg, #ffbe55 0%, #f08a2b 58%, #d44a14 100%)",
        borderRadius: 42,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 14,
          borderRadius: 34,
          background:
            "radial-gradient(circle at center, rgba(255, 245, 215, 0.58), transparent 62%)",
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          position: "relative",
          marginTop: -2,
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-end", gap: 0 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 999,
              background: "#fff9f2",
              marginRight: -4,
            }}
          />
          <div
            style={{
              width: 44,
              height: 42,
              borderRadius: 999,
              background: "#fff9f2",
              zIndex: 1,
            }}
          />
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 999,
              background: "#fff9f2",
              marginLeft: -4,
            }}
          />
        </div>

        <div
          style={{
            width: 92,
            height: 56,
            display: "flex",
            borderRadius: 16,
            overflow: "hidden",
            boxShadow: "0 8px 18px rgba(116, 45, 12, 0.22)",
            border: "4px solid #9a431a",
            background: "#fff9f0",
          }}
        >
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#fff9f0",
            }}
          >
            <div
              style={{
                width: 24,
                height: 24,
                display: "flex",
                background: "#f55361",
                transform: "rotate(45deg)",
                borderRadius: 6,
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  width: 24,
                  height: 24,
                  borderRadius: 999,
                  background: "#f55361",
                  left: -8,
                  top: 0,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  width: 24,
                  height: 24,
                  borderRadius: 999,
                  background: "#f55361",
                  left: 0,
                  top: -8,
                }}
              />
            </div>
          </div>

          <div
            style={{
              width: 4,
              background: "#c56f37",
            }}
          />

          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: 8,
              padding: "0 10px",
              background: "#fff5e8",
            }}
          >
            <div
              style={{
                height: 4,
                borderRadius: 999,
                background: "#d7c4a7",
              }}
            />
            <div
              style={{
                height: 4,
                width: 28,
                borderRadius: 999,
                background: "#d7c4a7",
              }}
            />
          </div>
        </div>
      </div>
    </div>,
    {
      ...size,
    },
  );
}
