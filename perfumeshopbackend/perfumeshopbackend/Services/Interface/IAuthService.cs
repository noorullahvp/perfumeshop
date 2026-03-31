using perfumeshopbackend.DTO.AuthDTO;

namespace perfumeshopbackend.Services.Interface
{
    public interface IAuthService
    {
        Task<AuthResponseDto> RegisterAsync(RegisterRequestDto requestDto);
        Task<AuthResponseDto> LoginAsync(LoginRequestDto loginRequestDto);

        Task<AuthResponseDto> RefreshTokenAsync(string refreshToken);
        Task<bool> RevokeTokenAsync(string refreshToken);

    }
}
